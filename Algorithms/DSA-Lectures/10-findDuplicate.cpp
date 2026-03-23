#include<iostream>
using namespace std;

int duplicate(int arr[], int size){
    for(int i=0; i<size; i++){
        for(int j=0; j<size; j++){
            if(arr[i]==arr[j] && (i!=j)){
                return arr[i];
            }
            
        }
    }
    return 0;
}

int main()
{
    int array[5]={4, 2, 1, 3, 1};
    int brray[7]={6, 3, 1, 5, 4, 3, 2};
    cout<<duplicate(array, 5)<<endl;
    cout<<duplicate(brray, 7);
    return 0;
}